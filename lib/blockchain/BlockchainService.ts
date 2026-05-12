import { ethers } from "ethers";

export type IssuedSealTx = {
  txHash: string;
  polygonScanUrl: string;
  from: string;
  chainId: number;
  chainLabel: string;
};

function getPolygonRpcUrl(): string {
  const url = process.env.POLYGON_RPC_URL?.trim();
  if (!url) throw new Error("POLYGON_RPC_URL is not set");
  return url;
}

function getPolygonPrivateKey(): string {
  const pk = process.env.POLYGON_PRIVATE_KEY?.trim();
  if (!pk) throw new Error("POLYGON_PRIVATE_KEY is not set");
  return pk;
}

/**
 * Optional override: full base URL without trailing slash, e.g.
 * - Mainnet: https://polygonscan.com
 * - Amoy: https://amoy.polygonscan.com
 */
function explorerBaseFromEnv(): string | null {
  const b = process.env.POLYGON_EXPLORER_BASE_URL?.trim().replace(/\/$/, "");
  return b || null;
}

export function polygonScanTxUrl(chainId: number, txHash: string): string {
  const override = explorerBaseFromEnv();
  if (override) return `${override}/tx/${txHash}`;

  if (chainId === 137) return `https://polygonscan.com/tx/${txHash}`;
  if (chainId === 80001) return `https://mumbai.polygonscan.com/tx/${txHash}`;
  if (chainId === 80002) return `https://amoy.polygonscan.com/tx/${txHash}`;
  if (chainId === 1101) return `https://zkevm.polygonscan.com/tx/${txHash}`;
  // Unknown chain: do not guess mainnet — avoids "hash not found" confusion.
  return `https://polygonscan.com/tx/${txHash}`;
}

export function chainLabel(chainId: number): string {
  switch (chainId) {
    case 137:
      return "Polygon PoS (mainnet)";
    case 80001:
      return "Polygon Mumbai (testnet, deprecated)";
    case 80002:
      return "Polygon Amoy (testnet)";
    case 1101:
      return "Polygon zkEVM";
    default:
      return `chainId ${chainId}`;
  }
}

/**
 * Server-only issuer that records a skill seal "on-chain" as a signed transaction.
 *
 * NOTE (MVP): Without a deployed smart contract, we store the achievement in the tx `data`.
 * This still provides transparency via PolygonScan and a tamper-evident timestamp.
 */
export class BlockchainService {
  private provider: ethers.JsonRpcProvider;
  private wallet: ethers.Wallet;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(getPolygonRpcUrl());
    this.wallet = new ethers.Wallet(getPolygonPrivateKey(), this.provider);
  }

  /** Encode a minimal, human-readable payload into transaction data. */
  private encodeSealPayload(args: {
    studentAddress: string;
    skillName: string;
    score: number;
    issuedAtIso: string;
    issuer: "Sanad" | "Alumni";
  }): string {
    const payload = {
      ufuq: "skill_seal_v1",
      student: args.studentAddress,
      skill: args.skillName,
      score: args.score,
      issuer: args.issuer,
      issuedAt: args.issuedAtIso,
    };
    const json = JSON.stringify(payload);
    return ethers.hexlify(ethers.toUtf8Bytes(json));
  }

  async issueSkillSeal(
    studentAddress: string,
    skillName: string,
    score: number,
    issuer: "Sanad" | "Alumni" = "Sanad",
  ): Promise<IssuedSealTx> {
    if (!ethers.isAddress(studentAddress)) throw new Error("Invalid studentAddress");
    if (!skillName?.trim()) throw new Error("skillName is required");
    if (!Number.isFinite(score) || score < 0 || score > 100) throw new Error("score must be 0..100");

    const issuedAtIso = new Date().toISOString();
    const data = this.encodeSealPayload({ studentAddress, skillName: skillName.trim(), score, issuer, issuedAtIso });

    // Zero-value, data-only tx sent to issuer's own address.
    const tx = await this.wallet.sendTransaction({
      to: this.wallet.address,
      value: 0n,
      data,
    });

    await tx.wait();
    const chainId = Number((await this.provider.getNetwork()).chainId);

    return {
      txHash: tx.hash,
      polygonScanUrl: polygonScanTxUrl(chainId, tx.hash),
      from: this.wallet.address,
      chainId,
      chainLabel: chainLabel(chainId),
    };
  }

  async verifyTx(txHash: string): Promise<{ ok: boolean; polygonScanUrl: string }> {
    const net = await this.provider.getNetwork();
    const url = polygonScanTxUrl(Number(net.chainId), txHash);
    const tx = await this.provider.getTransaction(txHash);
    return { ok: Boolean(tx), polygonScanUrl: url };
  }
}


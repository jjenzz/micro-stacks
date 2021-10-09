import { ClarityValue, cvToHex } from 'micro-stacks/clarity';
import { getPublicKey } from 'noble-secp256k1';
import { signTransactionPayload } from './sign';
import { TransactionTypes } from './types';
import type { ContractCallTxOptions, ContractCallTxPayload } from './types';
import { cleanHex } from 'micro-stacks/common';

/**
 * makeContractCallToken
 *
 * Make a contract call transaction token for use with a wallet based authenticator
 * @param functionArgs
 * @param privateKey
 * @param options
 */
export async function makeContractCallToken({
  functionArgs,
  privateKey,
  ...options
}: ContractCallTxOptions) {
  const publicKey = getPublicKey(privateKey, true);

  const payload: ContractCallTxPayload = {
    ...options,
    functionArgs: functionArgs.map((arg: string | ClarityValue) =>
      cleanHex(typeof arg === 'string' ? arg : cvToHex(arg))
    ),
    txType: TransactionTypes.ContractCall,
    publicKey,
  };

  return signTransactionPayload(payload, privateKey);
}
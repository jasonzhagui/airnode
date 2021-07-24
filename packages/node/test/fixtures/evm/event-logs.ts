import { ethers } from 'ethers';

type Log = ethers.providers.Log;

// =================================================================
// Regular requests
// =================================================================
export function buildClientRequest(overrides?: Partial<Log>): Log {
  return {
    blockNumber: 12,
    blockHash: '0x458042df79d347cb555aac9cd71f6e98fd920356d56af3a5ab46ab81c1838a31',
    transactionIndex: 0,
    removed: false,
    address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    data: '0x00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000007a69000000000000000000000000e7f1725e7734ce288f8367e1bb143e90bb3f051241e0458b020642796b14db9bb790bcdebab805ec4b639232277f0e007b0887960000000000000000000000000000000000000000000000000000000000000005000000000000000000000000d748bc4212d8130879ec4f24b950caab9eddfcb2000000000000000000000000e7f1725e7734ce288f8367e1bb143e90bb3f051248a4157c00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000012000000000000000000000000000000000000000000000000000000000000000a0316262000000000000000000000000000000000000000000000000000000000066726f6d000000000000000000000000000000000000000000000000000000004554480000000000000000000000000000000000000000000000000000000000746f0000000000000000000000000000000000000000000000000000000000005553440000000000000000000000000000000000000000000000000000000000',
    topics: [
      '0x8339fddbb81e588a9ed04dec82ee9ae6c7a185f44835adaaa2ace50ce3a14aaf',
      '0x19255a4ec31e89cea54d1f125db7536e874ab4a96b4d4f6438668b6bb10a6adb',
      '0x676274e2d1979dbdbd0b6915276fcb2cc3fb3be32862eab9d1d201882edc8c93',
    ],
    transactionHash: '0x1cfc090626709b59a7572886f763cc9756b9f2fd15a9ae9d4af9e3b1c71c736e',
    logIndex: 0,
    ...overrides,
  };
}

export function buildClientRequestFulfilled(overrides?: Partial<Log>): Log {
  return {
    blockNumber: 20,
    blockHash: '0x42264bc78c914bbdc0b7e0acb8da1a2be12ba1dc8fcb75a49116784d43d93412',
    transactionIndex: 0,
    removed: false,
    address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    data: '0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000043',
    topics: [
      '0xcde46e28d8d3e348e5f5b4fcc511fe3b1f9b0f549cd8332f0da31802a6f2bf61',
      '0x19255a4ec31e89cea54d1f125db7536e874ab4a96b4d4f6438668b6bb10a6adb',
      '0x676274e2d1979dbdbd0b6915276fcb2cc3fb3be32862eab9d1d201882edc8c93',
    ],
    transactionHash: '0xb5e91680be948547b6959031040b3995348e33538a547859c12e2371cd7848a4',
    logIndex: 0,
    ...overrides,
  };
}

// =================================================================
// Full requests
// =================================================================
export function buildFullClientRequest(overrides?: Partial<Log>): Log {
  return {
    blockNumber: 16,
    blockHash: '0x9023292f59fe980a807f846db807e074d22b559065afba1af4948ae42239068c',
    transactionIndex: 0,
    removed: false,
    address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    data: '0x00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000007a69000000000000000000000000e7f1725e7734ce288f8367e1bb143e90bb3f0512eddc421714e1b46ef350e8ecf380bd0b38a40ce1a534e7ecdf4db7dbc9319353000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000001c5b7e13fe3977a384397b17b060ec96ea322dec000000000000000000000000e7f1725e7734ce288f8367e1bb143e90bb3f051248a4157c000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000120000000000000000000000000000000000000000000000000000000000000016031626262626200000000000000000000000000000000000000000000000000005f74797065000000000000000000000000000000000000000000000000000000696e7432353600000000000000000000000000000000000000000000000000005f70617468000000000000000000000000000000000000000000000000000000726573756c7400000000000000000000000000000000000000000000000000005f74696d65730000000000000000000000000000000000000000000000000000313030303030000000000000000000000000000000000000000000000000000066726f6d000000000000000000000000000000000000000000000000000000004554480000000000000000000000000000000000000000000000000000000000746f0000000000000000000000000000000000000000000000000000000000005553440000000000000000000000000000000000000000000000000000000000',
    topics: [
      '0xe8ae99161b1547fd1c6ff3cb9660293fa4cd770fd52f72ff0362d64d8bccc08e',
      '0x19255a4ec31e89cea54d1f125db7536e874ab4a96b4d4f6438668b6bb10a6adb',
      '0xd1984b7f40c4b5484b756360f56a41cb7ee164d8acd0e0f18f7a0bbf5a353e65',
    ],
    transactionHash: '0xa82113c5d0fa499ed0b48de7cafcd72c53e4dc9a99279c1876a591169dd06877',
    logIndex: 0,
    ...overrides,
  };
}

export function buildFullRequestFulfilled(overrides?: Partial<Log>): Log {
  return {
    blockNumber: 21,
    blockHash: '0xc7b5393a877e8bd1cb3bc44e9dde29fbe2c3c2e9df022d1277ca4e97505a07f2',
    transactionIndex: 0,
    removed: false,
    address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    data: '0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000043',
    topics: [
      '0xcde46e28d8d3e348e5f5b4fcc511fe3b1f9b0f549cd8332f0da31802a6f2bf61',
      '0x19255a4ec31e89cea54d1f125db7536e874ab4a96b4d4f6438668b6bb10a6adb',
      '0xd1984b7f40c4b5484b756360f56a41cb7ee164d8acd0e0f18f7a0bbf5a353e65',
    ],
    transactionHash: '0xf731d66caaaf31565716d7a6f626def0584b8e3771a07739ddf3f676b5ec93da',
    logIndex: 0,
    ...overrides,
  };
}

// =================================================================
// Withdrawals
// =================================================================
export function buildWithdrawalRequest(overrides?: Partial<Log>): Log {
  return {
    blockNumber: 18,
    blockHash: '0x6a1cc2c95d739003d023b5ed3174979fed0a26c5ec3b2eec21d4950120abaa90',
    transactionIndex: 0,
    removed: false,
    address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    data: '0x00000000000000000000000034e9a78d63c9ca2148c95e880c6b1f48ae7f121e0000000000000000000000006812efaf684aa899949212a2a6785305ec0f1474',
    topics: [
      '0x3d0ebccb4fc9730699221da0180970852f595ed5c78781346149123cbbe9f1d3',
      '0x19255a4ec31e89cea54d1f125db7536e874ab4a96b4d4f6438668b6bb10a6adb',
      '0x0000000000000000000000000000000000000000000000000000000000000001',
      '0xd9db6b416bbd9a87f4e693d66a0323eafde6591cae537727cd1f4e7ff0b53d5a',
    ],
    transactionHash: '0xac3aa3683548a631dd7561cfa32d4e003f43bfc061bb40adc9920c9c1d4d6a60',
    logIndex: 0,
    ...overrides,
  };
}

export function buildWithdrawalFulfilled(overrides?: Partial<Log>): Log {
  return {
    blockNumber: 22,
    blockHash: '0x10036d3cc8f54317033f529627280652129644ce01301a5856d82219bd4250be',
    transactionIndex: 0,
    removed: false,
    address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    data: '0x00000000000000000000000034e9a78d63c9ca2148c95e880c6b1f48ae7f121e0000000000000000000000006812efaf684aa899949212a2a6785305ec0f14740000000000000000000000000000000000000000000000000ddef4ab537b4000',
    topics: [
      '0x9e7b58b29aa3b972bb0f457499d0dfd00bf23905b0c3358fb864e7120402aefa',
      '0x19255a4ec31e89cea54d1f125db7536e874ab4a96b4d4f6438668b6bb10a6adb',
      '0x0000000000000000000000000000000000000000000000000000000000000001',
      '0xd9db6b416bbd9a87f4e693d66a0323eafde6591cae537727cd1f4e7ff0b53d5a',
    ],
    transactionHash: '0xd7018b960a11f53e83763b2a3c582b5e9178caf24fe0e17e3d3367962af8885f',
    logIndex: 0,
    ...overrides,
  };
}

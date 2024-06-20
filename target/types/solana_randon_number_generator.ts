export type SolanaRandonNumberGenerator = {
  "version": "0.1.0",
  "name": "solana_randon_number_generator",
  "constants": [
    {
      "name": "RANDOM_TAG",
      "type": "bytes",
      "value": "[114, 97, 110, 100, 111, 109]"
    }
  ],
  "instructions": [
    {
      "name": "init",
      "accounts": [
        {
          "name": "random",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "generateAndStore",
      "accounts": [
        {
          "name": "random",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [],
      "returns": "u64"
    },
    {
      "name": "generateWithSwitchboard",
      "accounts": [
        {
          "name": "random",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "aggregator",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [],
      "returns": "u64"
    }
  ],
  "accounts": [
    {
      "name": "random",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "number",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "InitEvent",
      "fields": [
        {
          "name": "number",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "RandomNumberEvent",
      "fields": [
        {
          "name": "value",
          "type": "u64",
          "index": false
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "ErrorParsingRandomAccountData",
      "msg": "Error: Parsing random account data!"
    },
    {
      "code": 6001,
      "name": "RandomValueNotFound",
      "msg": "Error while getting random value!"
    }
  ]
};

export const IDL: SolanaRandonNumberGenerator = {
  "version": "0.1.0",
  "name": "solana_randon_number_generator",
  "constants": [
    {
      "name": "RANDOM_TAG",
      "type": "bytes",
      "value": "[114, 97, 110, 100, 111, 109]"
    }
  ],
  "instructions": [
    {
      "name": "init",
      "accounts": [
        {
          "name": "random",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "generateAndStore",
      "accounts": [
        {
          "name": "random",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [],
      "returns": "u64"
    },
    {
      "name": "generateWithSwitchboard",
      "accounts": [
        {
          "name": "random",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "aggregator",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [],
      "returns": "u64"
    }
  ],
  "accounts": [
    {
      "name": "random",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "number",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "InitEvent",
      "fields": [
        {
          "name": "number",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "RandomNumberEvent",
      "fields": [
        {
          "name": "value",
          "type": "u64",
          "index": false
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "ErrorParsingRandomAccountData",
      "msg": "Error: Parsing random account data!"
    },
    {
      "code": 6001,
      "name": "RandomValueNotFound",
      "msg": "Error while getting random value!"
    }
  ]
};

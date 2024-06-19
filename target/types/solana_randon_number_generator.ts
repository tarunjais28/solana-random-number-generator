/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/solana_randon_number_generator.json`.
 */
export type SolanaRandonNumberGenerator = {
  "address": "4QTGKkJgNysqKFLjXtmAZvBBH3eKKHgtQa5eBoJu2TpR",
  "metadata": {
    "name": "solanaRandonNumberGenerator",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "generateAndStore",
      "discriminator": [
        82,
        48,
        234,
        224,
        183,
        241,
        237,
        141
      ],
      "accounts": [
        {
          "name": "random",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  97,
                  110,
                  100,
                  111,
                  109
                ]
              }
            ]
          }
        }
      ],
      "args": [],
      "returns": "u64"
    },
    {
      "name": "init",
      "discriminator": [
        220,
        59,
        207,
        236,
        108,
        250,
        47,
        100
      ],
      "accounts": [
        {
          "name": "random",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  97,
                  110,
                  100,
                  111,
                  109
                ]
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "random",
      "discriminator": [
        63,
        64,
        207,
        226,
        234,
        116,
        174,
        141
      ]
    }
  ],
  "events": [
    {
      "name": "initEvent",
      "discriminator": [
        224,
        129,
        78,
        87,
        58,
        43,
        94,
        127
      ]
    },
    {
      "name": "randomNumberEvent",
      "discriminator": [
        64,
        14,
        85,
        240,
        187,
        99,
        18,
        85
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "insufficientFunds",
      "msg": "Error: Your balance is not enough!"
    },
    {
      "code": 6001,
      "name": "unauthorized",
      "msg": "Error: Unauthorized User!"
    },
    {
      "code": 6002,
      "name": "orderIdConversionError",
      "msg": "Error while converting order_id!"
    },
    {
      "code": 6003,
      "name": "amountConversionError",
      "msg": "Error while converting amount!"
    },
    {
      "code": 6004,
      "name": "addressConversionError",
      "msg": "Error while converting address!"
    },
    {
      "code": 6005,
      "name": "uintConversionError",
      "msg": "Error while converting uint!"
    },
    {
      "code": 6006,
      "name": "hexDecodeError",
      "msg": "Error while decoding hex!"
    },
    {
      "code": 6007,
      "name": "actionDecodeError",
      "msg": "Error while decoding action!"
    },
    {
      "code": 6008,
      "name": "invalidRequest",
      "msg": "Request is invalid!"
    },
    {
      "code": 6009,
      "name": "invalidAction",
      "msg": "Action is invalid!"
    }
  ],
  "types": [
    {
      "name": "initEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "number",
            "type": "u64"
          }
        ]
      }
    },
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
    },
    {
      "name": "randomNumberEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "value",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "constants": [
    {
      "name": "randomTag",
      "type": "bytes",
      "value": "[114, 97, 110, 100, 111, 109]"
    }
  ]
};

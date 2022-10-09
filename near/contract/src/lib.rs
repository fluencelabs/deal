use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::json_types::Base64VecU8;
use near_sdk::near_bindgen;

use air::execute_air;
use air::RunParameters;

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Aqua {}

impl Default for Aqua {
    fn default() -> Self {
        Self {}
    }
}

#[near_bindgen]
impl Aqua {
    pub fn invoke(
        &self,
        air: String,
        prev_data: Base64VecU8,
        params: Base64VecU8,
        call_results: Base64VecU8,
    ) -> String {
        let params: Vec<u8> = params.into();
        let params: RunParameters =
            serde_json::from_slice(&params).expect("cannot parse RunParameters");
        let outcome = execute_air(air, prev_data.into(), vec![], params, call_results.into());
        return serde_json::to_string(&outcome).expect("Cannot parse InterpreterOutcome");
    }
}

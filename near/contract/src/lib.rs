use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::env::log_str;
use near_sdk::{near_bindgen, require};

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
    pub fn verify_script(
        &self,
        #[serializer(borsh)] air: String,
        #[serializer(borsh)] prev_data: String,
        #[serializer(borsh)] params: String,
        #[serializer(borsh)] call_results: String,
    ) {
        require!(
            Self::execute(air, prev_data.into(), params.into(), call_results.into()) == true,
            "Script failed to execute"
        );
    }

    pub fn verify_script_json(
        &self,
        air: String,
        prev_data: String,
        params: String,
        call_results: String,
    ) -> bool {
        return Self::execute(air, prev_data.into(), params.into(), call_results.into());
    }

    // private method
    fn execute(air: String, prev_data: Vec<u8>, params: Vec<u8>, call_results: Vec<u8>) -> bool {
        let params: RunParameters =
            serde_json::from_slice(&params).expect("cannot parse RunParameters");
        let outcome = execute_air(air, prev_data.into(), vec![], params, call_results.into());

        log_str(&serde_json::to_string(&outcome).expect("Cannot parse InterpreterOutcome"));

        return outcome.ret_code == 0;
    }
}

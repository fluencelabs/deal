use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{LookupMap, LookupSet};
use near_sdk::json_types::Base64VecU8;
use near_sdk::{log, near_bindgen, require, AccountId};

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Deal {
    balance: u128,
    debt: u128,
    slashed: LookupSet<AccountId>,
    rewards: LookupMap<AccountId, u128>,
    validators: LookupSet<AccountId>,
}

impl Default for Deal {
    fn default() -> Self {
        Self {
            balance: 0,
            debt: 0,
            slashed: LookupSet::new(b"slashed".to_vec()),
            rewards: LookupMap::new(b"rewards".to_vec()),
            validators: LookupSet::new(b"validators".to_vec()),
        }
    }
}

#[near_bindgen]
impl Deal {
    /*
    #[init]
    pub fn new() -> Self {
        log!("Custom counter initialization!");
        Self {
            balance: 0,
            debt: 0,
            slashed: LookupSet::new(b"slashing".to_vec()),
            validators: LookupSet::new(b"validators".to_vec()),
            rewards: LookupMap::new(b"rewards".to_vec()),
        }
    } */

    pub fn update_balance(&mut self, balance: u128) {
        self.balance = balance;
        log!("Update balance {}", balance);
    }

    pub fn withdraw(&mut self, value: u128) {
        let free = self.balance - self.debt;
        require!(free >= value, "Not enough balance");

        self.balance -= value;
        log!("Withdraw {}", value);
    }

    pub fn add_validator(&mut self, validator: AccountId) {
        self.validators.insert(&validator);
        log!("Add validator {}", &validator);
    }

    pub fn remove_validator(&mut self, validator: AccountId) {
        self.validators.remove(&validator);
        log!("Remove validator {}", &validator);
    }

    pub fn unslash(&mut self, validator: AccountId) {
        self.slashed.remove(&validator);
        log!("Unslash validator {}", &validator);
    }

    pub fn withdraw_reward(&mut self, validator: AccountId) {
        let reward = self.rewards.get(&validator).unwrap_or(0);
        require!(reward > 0, "No reward to withdraw");

        self.rewards.remove(&validator);

        self.debt -= reward;
        log!("Unslash validator {}", &validator);
    }

    pub fn send_script(&mut self, script: Base64VecU8, validator: AccountId) {
        if !self.is_valid_script(&script, &validator) {
            self.slash(&validator);
            return;
        }

        if !self.is_golden_particle(&script, &validator) {
            return;
        }

        let reward = 1000;
        let debt = self.debt + reward;
        require!(self.balance >= debt, "Not enough balance");

        self.debt = debt;
        self.rewards.insert(&validator, &reward);

        log!("Set reward {}", &validator);
    }

    #[private]
    fn slash(&mut self, validator: &AccountId) {
        self.slashed.insert(&validator);
        self.validators.remove(&validator);
        log!("Slashed {}", &validator);
    }

    #[private]
    fn is_valid_script(&self, script: &Base64VecU8, validator: &AccountId) -> bool {
        return false;
    }

    #[private]
    fn is_golden_particle(&self, script: &Base64VecU8, validator: &AccountId) -> bool {
        return true;
    }
}

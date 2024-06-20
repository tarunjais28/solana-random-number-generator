use super::*;

#[error_code]
pub enum CustomError {
    #[msg("Error: Parsing random account data!")]
    ErrorParsingRandomAccountData,

    #[msg("Error while getting random value!")]
    RandomValueNotFound,
}

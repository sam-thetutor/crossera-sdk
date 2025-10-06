# Changelog

## [1.1.0] - 2025-10-06

### Added
- ✅ Batch processing support via `submitForProcessing()` method
- ✅ Transaction status checking via `getTransactionStatus()` method
- ✅ Network parameter now included in all batch processing requests
- ✅ Support for UUID-based transaction IDs
- ✅ Enhanced status tracking with retry counts and error messages
- ✅ On-chain process transaction hash in status response
- ✅ Estimated processing time for pending transactions
- ✅ Batch info details (batch ID, timestamps, status)

### Changed
- 🔧 Request format changed from snake_case to camelCase (`transactionHash` instead of `transaction_hash`)
- 🔧 Database ID type changed from `number` to `string` (UUID)
- 🔧 Added `network` query parameter to status endpoint
- 🔧 Enhanced `TransactionStatus` interface with new fields

### Fixed
- ✅ Status endpoint now properly filters by network
- ✅ Better error handling for 409 conflicts
- ✅ Improved field name mapping between API and SDK

## [1.0.7] - Previous Release

### Features
- Basic transaction submission
- App ID lookup by address
- Network configuration utilities


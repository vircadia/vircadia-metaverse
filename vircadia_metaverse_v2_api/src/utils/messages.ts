//   Copyright 2020 Vircadia Contributors
//   Copyright 2022 DigiSomni LLC.
//
//   Licensed under the Apache License, Version 2.0 (the "License");
//   you may not use this file except in compliance with the License.
//   You may obtain a copy of the License at
//
//       http://www.apache.org/licenses/LICENSE-2.0
//
//   Unless required by applicable law or agreed to in writing, software
//   distributed under the License is distributed on an "AS IS" BASIS,
//   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//   See the License for the specific language governing permissions and
//   limitations under the License.

'use strict';

export const messages = {
    common_messages_db_error: 'Database loading fail.',
    common_messages_error: 'Something went wrong, please try again later.',
    common_messages_social_error: 'Social login fail. please try again later.',
    common_messages_record_available: 'Record is available.',
    common_messages_record_not_available: 'Record is not available.',
    common_messages_records_available: 'Records are available.',
    common_messages_records_not_available: 'Records are not available.',
    common_messages_record_added_failed: 'Failed to add record!',
    common_messages_target_profile_notfound: 'Target profile not found',
    common_messages_target_account_notfound: 'Target account not found',
    common_messages_user_email_link_error:
        'Email already exists for another account',
    common_messages_user_does_not_exist: 'User does not exist',
    common_messages_ethereum_address_exists: 'Ethereum Address already exists',
    common_messages_unauthorized: 'Unauthorized',
    common_messages_email_validation_error: 'Invalid email address',
    common_messages_error_missing_verification_pending_request:
        'Not verified. No pending verification request',
    common_messages_error_verify_request_expired:
        'Not verified. Request expired',
    common_messages_target_domain_notfound: 'DomainId does not match a domain',
    common_messages_data_notfound: 'Data not found',
    common_messages_thumbnail_size_exceeded:
        'Thumbnail file size is outside the desired range.',
    common_messages_avatar_size_exceeded:
        'Avatar file size is outside the desired range.',
    common_messages_avatar_invalid_file_type:
        'Avatar file type is not allowed.',
    common_messages_asset_file_missing: 'Asset file not found.',
    common_messages_target_place_notfound: 'Target place not found',
    common_messages_not_logged_in: 'Not logged in',
    common_messages_no_such_place: 'No such place',
    common_messages_badly_formed_data: 'badly formed data',
    common_messages_badly_formed_request: 'Badly formed request',
    common_messages_badly_formed_username: 'Badly formatted username',
    common_messages_place_exists: 'Place name already exists or is too long',
    common_messages_name_address_domainId_not_specific:
        'name/address/domainId not specified',
    common_messages_name_address_domainId_must_specific:
        'name, address, and domainId must be specified',
    common_messages_cannot_add_connections_this_way:
        'Cannot add connections this way',
    common_messages_already_in_connection: 'User is already in connection',
    common_messages_not_allow_self_connect:
        'User does not allowed to self-connection',
    common_messages_cannot_add_friend_who_not_connection:
        'Cannot add friend who is not a connection',
    common_messages_no_friend_found: 'No friend found',
    common_messages_account_already_exists: 'Account already exists',
    common_messages_could_not_create_account: 'Could not create account',
    common_messages_no_placeId: 'No placeId',
    common_messages_no_current_api_key: 'No current_api_key',
    common_messages_no_place_by_placeId:
        'Place specified by placeId does not exist',
    common_messages_no_place_by_accountId:
        'Account specified by accountId does not exist',
    common_messages_place_apikey_lookup_fail: 'Place apikey lookup failed',
    common_messages_current_api_key_not_match_place_key:
        'current_api_key does not match Places key',
    common_messages_name_missing: 'Name is missing',
    common_messages_description_missing: 'Description is missing',
    common_messages_item_thumbnail_missing: 'Thumbnail url is missing',
    common_messages_item_url_missing: 'Item url is missing',
    common_messages_item_type_missing: 'Item type is missing',
    common_messages_item_source_missing: 'Item source is missing',
    common_messages_item_quality_missing: 'Item quality is missing',
    common_messages_uknown_stat: 'Unknown stat',
    common_messages_target_item_notfound: 'Target item not found',
    // eslint-disable-next-line quotes
    common_messages_transfer_qry_error: "You don't have enough quantity",
    common_messages_item_not_transferable: 'Item is not transferable',
    common_messages_parameter_missing: 'Parameter is missing',
    common_messages_avatar_not_available: 'Avatar is not available.',
    common_messages_achievement_item_not_available:
        'Achievement item is not available.',
    common_messages_achievement_already_achieved:
        'Achievement is already achieved.',
    common_messages_achievement_not_found: 'Achievement not found.',
    common_messages_otp_expired: 'Otp is expired',
    common_messages_invalid_otp_secret: 'Otp or secret key is invalid',
    common_messages_password_changed_successfully:
        'Password is changed successfully',
    common_messages_itemid_missing: 'Item id is missing.',
    common_messages_item_already_exist_in_user_inventory:
        'This item already exists in user inventory.',
    common_messages_endpoint_not_exist: 'No such API endpoint exists.',
    common_messages_itemhandler_id_missing: 'Item Handler id is missing',
    common_messages_not_enough_qry_error: 'Don`t have enough quantity',
    common_messages_id_missing: 'Id is missing.',
    common_messages_owner_id_missing: 'Owner id is missing',
    common_messages_quest_id_missing: 'Quest id is missing',
    common_messages_quest_item_not_found: 'Quest item is not found',
    common_messages_quest_not_found: 'Quest is not found',
    common_messages_quest_already_completed: 'Quest is already completed.',
    common_messages_ncp_not_found: 'Ncp not found.',
    common_messages_quest_not_accepted: 'Quest is not accepted.',
    common_messages_inventory_requirement_not_fulfill:
        'Inventory requirement not fulfill.',
    common_messages_minigame_requirement_not_fulfill:
        'Mini game requirement not fulfill.',
    common_messages_quest_id_already_exist: 'Quest item id is already exist.',
    common_messages_npc_id_already_exist: 'Npc id is already exist.',
    common_messages_minigame_id_already_exist: 'Minigame id is already exist.',
    common_messages_master_data_init_success: 'Master data init successfully.',
    common_messages_inventory_item_id_already_exist:
        'Inventory item id is already exist.',
    common_messages_reward_item_id_already_exist:
        'Reward item id is already exist.',
    common_messages_action_not_allowed: 'Not allowed to perform this action.',
    common_messages_error_delete_default_resources:
        'Default resources can`t be deleted.',
    common_messages_error_inventory_item_not_found: 'Inventory item not found.',
    common_messages_today_reward_messages_already_claimed:
        'Today`s Reward has already been claimed.',
    common_messages_reward_messages_already_claimed:
        'Reward has already been claimed by you.',
    common_messages_account_cannot_access_this_field:
        'Account cannot access this field.',
    common_messages_account_cannot_set_this_field:
        'Account cannot set this field.',
    common_messages_field_not_found: 'Field not found.',
    common_messages_field_name_require: 'Field name is require.',
    common_messages_validation_error: 'Value did not validate.',
    common_messsages_cannot_set_field: 'Can not set this field.',
    common_messsages_cannot_get_field: 'Can not get this field.',
    common_messages_data_notfound_forfield: 'Data not found for this field',
    common_messages_token_account_not_match:
        'Token account does not match requested account',
    common_messages_token_not_found: 'Token not found',
    common_messages_tokenid_missing: 'Token id is missing.',
    common_messages_invalid_password: 'Invalid password',
    common_messages_account_notverified: 'Account not verified',
    common_messages_invalid_scope: 'Invalid scope',
    common_messages_bad_publickey: 'badly formed public key',
    common_messages_refresh_token_expired: 'Refresh token expired',
    common_message_already_verified: 'User already verified',
    common_messages_mail_already_sent:
        'Already sent, please check your mail box',
    common_messages_no_domain_token: 'No Domain token exist',
    common_messages_domain_unauthorized: 'Domain not authorized',
    common_domainId_notFound: 'Domain id not found',
    common_messages_blockchain_transaction_issue:
        'There was an issue sending blockchain transaction, please try again later.',
    common_messages_blockchain_transaction_insufficient_in_game_balance:
        'The amount exceeds available game balance',
    common_messages_no_ethereum_address:
        'The user does not have Ethereum address associated',
    common_messages_play_minigame: 'Play minigame to complete quest',
    common_messages_minigame_not_associated:
        'Mini game not associated with quest',
    common_messages_minigame_not_associated_questItem:
        'Mini game not associated with quest item',
    commmon_messages_minigame_not_found: 'Mini game not found',
    common_messages_bone_structure_not_found: 'Goobie bone structure not found',
    error_joi_messages_visibility: {
        'string.base': 'Visibility must be a string',
        'string.empty': 'Visibility is not allowed to be empty',
    },
    error_joi_messages_maturity: {
        'string.base': 'Maturity must be a string',
        'string.empty': 'Maturity is not allowed to be empty',
    },
    error_joi_messages_restiction: {
        'string.base': 'Restriction must be a string',
        'string.empty': 'Restriction is not allowed to be empty',
    },
    error_joi_messages_domainId: {
        'string.base': 'Domain Id must be a string',
        'string.empty': 'Domain is not allowed to be empty',
    },
    error_joi_messages_email: {
        'string.base': 'Email address must be a string',
        'string.empty': 'Email is not allowed to be empty',
        'string.email': 'Email must be a valid email',
    },
    error_joi_messages_number: {
        'number.base': 'Value must be a number',
        'number.integer': 'Value must be a number',
        'number.positive': 'Value must be a positive number',
    },
};

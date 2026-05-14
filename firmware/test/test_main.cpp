#include <unity.h>
#include "types.h"

void test_lock_state_enum_values() {
    TEST_ASSERT_EQUAL(0, static_cast<uint8_t>(LockState::kLocked));
    TEST_ASSERT_EQUAL(1, static_cast<uint8_t>(LockState::kUnlocked));
    TEST_ASSERT_EQUAL(2, static_cast<uint8_t>(LockState::kError));
}

void test_auth_result_enum_values() {
    TEST_ASSERT_EQUAL(0, static_cast<uint8_t>(AuthResult::kSuccess));
    TEST_ASSERT_EQUAL(1, static_cast<uint8_t>(AuthResult::kFailed));
    TEST_ASSERT_EQUAL(2, static_cast<uint8_t>(AuthResult::kTimeout));
    TEST_ASSERT_EQUAL(3, static_cast<uint8_t>(AuthResult::kNotEnrolled));
}

void setup() {
    UNITY_BEGIN();
    RUN_TEST(test_lock_state_enum_values);
    RUN_TEST(test_auth_result_enum_values);
    UNITY_END();
}

void loop() {}

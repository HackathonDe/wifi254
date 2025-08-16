<?php
// callback.php
header("Content-Type: application/json");

require_once 'db.php';

// Read callback data
$callbackData = json_decode(file_get_contents('php://input'), true);

// Log raw data (for debugging)
file_put_contents("mpesa_callback_log.json", json_encode($callbackData, JSON_PRETTY_PRINT) . PHP_EOL, FILE_APPEND);

if (isset($callbackData['Body']['stkCallback'])) {
  $callback = $callbackData['Body']['stkCallback'];
  $checkoutRequestID = $callback['CheckoutRequestID'];
  $resultCode = $callback['ResultCode'];
  $resultDesc = $callback['ResultDesc'];

  if ($resultCode == 0) {
    // Success
    $metadata = $callback['CallbackMetadata']['Item'];
    $amount = $metadata[0]['Value'];
    $mpesaReceipt = $metadata[1]['Value'];
    $phoneNumber = $metadata[4]['Value'];

    // Update transaction
    $stmt = $pdo->prepare("UPDATE transactions SET 
            status = 'completed',
            mpesa_receipt = ?,
            amount = ?,
            phone = ?,
            result_desc = ?,
            transaction_date = NOW(),
            updated_at = NOW()
            WHERE transaction_id = ?");
    $stmt->execute([$mpesaReceipt, $amount, $phoneNumber, $resultDesc, $checkoutRequestID]);
  } else {
    // Failure
    $stmt = $pdo->prepare("UPDATE transactions SET 
            status = 'failed',
            result_desc = ?,
            updated_at = NOW()
            WHERE transaction_id = ?");
    $stmt->execute([$resultDesc, $checkoutRequestID]);
  }
}

echo json_encode(["ResultCode" => 0, "ResultDesc" => "Callback received successfully"]);

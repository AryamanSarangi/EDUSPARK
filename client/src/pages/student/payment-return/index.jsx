import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { captureAndFinalizePaymentService } from "@/services";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function PaypalPaymentReturnPage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const paymentId = params.get("paymentId");
  const payerId = params.get("PayerID");
  const simulated = params.get("simulated");
  const orderIdFromQuery = params.get("orderId");

  useEffect(() => {
    async function finalize() {
      // Prefer orderId from URL (simulated flow), else fall back to session
      const orderId = orderIdFromQuery || JSON.parse(sessionStorage.getItem("currentOrderId"));
      if (!orderId) return;

      const response = await captureAndFinalizePaymentService(
        paymentId || "SIMULATED",
        payerId || "SIMULATED",
        orderId
      );

      if (response?.success) {
        sessionStorage.removeItem("currentOrderId");
        window.location.href = "/student-courses";
      }
    }

    // Real PayPal: both params exist. Simulated flow: simulated=true and orderId present
    if ((paymentId && payerId) || (simulated === "true" && orderIdFromQuery)) {
      finalize();
    }
  }, [payerId, paymentId, simulated, orderIdFromQuery]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Processing payment... Please wait</CardTitle>
      </CardHeader>
    </Card>
  );
}

export default PaypalPaymentReturnPage;

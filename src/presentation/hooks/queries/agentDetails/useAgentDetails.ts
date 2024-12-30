import { ManageAgentQueryByIdInstance } from "@app/useCases/agent/ManageAgents/query/ManageAgentsQueryById";
import { AgentUrlEnum } from "@domain/enums";
import { CustomToast } from "@presentation/components";
import { ID, QUERIES } from "@presentation/helpers";
import { useQuery } from "react-query";

export const useAgentDetails = (id: number, itemIdForUpdate: string | ID) => {
  const { data: agentData, isLoading: isAgentDataLoading } = useQuery({
    queryKey: [QUERIES.AgentList, id],
    queryFn: () => {
      return ManageAgentQueryByIdInstance.getAgentById(
        AgentUrlEnum.GetAgentById,
        id
      );
    },
    enabled: itemIdForUpdate === id,

    onError: (error) => {
      CustomToast(`Failed to get Agent data ${error}`, "error");
    },
  });

  //? credit limit
  const { data: creditLimitData, isLoading: isCreditLimitDataLoading } =
    useQuery({
      queryKey: [QUERIES.AgentCreditLimit, id],
      queryFn: () => {
        return ManageAgentQueryByIdInstance.getCreditLimitById(
          AgentUrlEnum.GetCreditLimitById,
          id
        );
      },
      enabled: itemIdForUpdate === id,

      onError: (error) => {
        CustomToast(`Failed to get credit limit data ${error}`, "error");
      },
    });

  //? card details
  const { data: cardDetailsData, isLoading: isCardDetailsDataLoading } =
    useQuery({
      queryKey: [QUERIES.AgentCardDetails, id],
      queryFn: () => {
        return ManageAgentQueryByIdInstance.getCardDetailsById(
          AgentUrlEnum.GetCardDetailsById,
          id
        );
      },
      enabled: itemIdForUpdate === id,

      onError: (error) => {
        CustomToast(`Failed to get card details data ${error}`, "error");
      },
    });

  //? payment details
  const { data: paymentData, isLoading: isPaymentDataLoading } = useQuery({
    queryKey: [QUERIES.AgentPayment, id],
    queryFn: () => {
      return ManageAgentQueryByIdInstance.getPaymentById(
        AgentUrlEnum.GetPaymentById,
        id
      );
    },
    enabled: itemIdForUpdate === id,

    onError: (error) => {
      CustomToast(`Failed to get payment data ${error}`, "error");
    },
  });

  //? registration
  const { data: registrationData, isLoading: isRegistrationDataLoading } =
    useQuery({
      queryKey: [QUERIES.AgentRegistration, id],
      queryFn: () => {
        return ManageAgentQueryByIdInstance.getRegistrationById(
          AgentUrlEnum.GetRegistrationById,
          id
        );
      },
      enabled: itemIdForUpdate === id,

      onError: (error) => {
        CustomToast(`Failed to get registration data ${error}`, "error");
      },
    });

  //? SMTP
  const { data: SMTPData, isLoading: isSMTPDataLoading } = useQuery({
    queryKey: [QUERIES.AgentSMTP, id],
    queryFn: () => {
      return ManageAgentQueryByIdInstance.getSMTPById(
        AgentUrlEnum.GetSMTPById,
        id
      );
    },
    enabled: itemIdForUpdate === id,

    onError: (error) => {
      CustomToast(`Failed to get SMTP data ${error}`, "error");
    },
  });

  //? payment gateway
  const { data: paymentGatewayData, isLoading: isPaymentGatewayDataLoading } =
    useQuery({
      queryKey: [QUERIES.AgentPaymentGateway, id],
      queryFn: () => {
        return ManageAgentQueryByIdInstance.getPaymentGatewayById(
          AgentUrlEnum.GetPaymentGatewayById,
          id
        );
      },
      enabled: itemIdForUpdate === id,

      onError: (error) => {
        CustomToast(`Failed to get payment gateway data ${error}`, "error");
      },
    });

  const isLoading =
    isAgentDataLoading ||
    isCreditLimitDataLoading ||
    isCardDetailsDataLoading ||
    isPaymentDataLoading ||
    isRegistrationDataLoading ||
    isSMTPDataLoading;
  isPaymentGatewayDataLoading;

  return {
    agentData,
    creditLimitData,
    cardDetailsData,
    paymentData,
    registrationData,
    SMTPData,
    paymentGatewayData,
    isLoading,
  };
};

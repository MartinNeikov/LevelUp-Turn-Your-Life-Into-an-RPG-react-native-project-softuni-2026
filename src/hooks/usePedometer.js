import { useEffect, useState } from "react";
import { AppState } from "react-native";
import { Pedometer } from "expo-sensors";

export default function usePedometer(isTracking) {
  const [steps, setSteps] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!isTracking) {
      return;
    }

    let isActive = true;
    let subscription = null;
    let requestId = 0;
    let accumulatedSteps = 0;
    let currentSteps = 0;

    setSteps(0);
    setErrorMessage("");

    function stopListening() {
      requestId += 1;

      subscription?.remove();
      subscription = null;

      accumulatedSteps += currentSteps;
      currentSteps = 0;
    }

    async function startListening() {
      const currentRequest = ++requestId;

      function canContinue() {
        return (
          isActive &&
          currentRequest === requestId &&
          AppState.currentState === "active"
        );
      }

      setIsChecking(true);
      setErrorMessage("");

      try {
        let permission = await Pedometer.getPermissionsAsync();

        if (!canContinue()) return;

        if (!permission.granted && permission.canAskAgain) {
          permission = await Pedometer.requestPermissionsAsync();
        }

        if (!canContinue()) return;

        if (!permission.granted) {
          setErrorMessage(
            "Step counting permission is required. Enable it in your phone settings.",
          );
          return;
        }

        const isAvailable = await Pedometer.isAvailableAsync();

        if (!canContinue()) return;

        if (!isAvailable) {
          setErrorMessage("Step counting is not available on this device.");
          return;
        }

        subscription = Pedometer.watchStepCount((result) => {
          if (!canContinue()) return;

          currentSteps = result.steps;
          setSteps(accumulatedSteps + currentSteps);
        });
      } catch (error) {
        if (canContinue()) {
          console.error("Failed to start step counting:", error);
          setErrorMessage("Could not start step counting. Please try again.");
        }
      } finally {
        if (isActive && currentRequest === requestId) {
          setIsChecking(false);
        }
      }
    }

    const appStateSubscription = AppState.addEventListener(
      "change",
      (nextState) => {
        stopListening();

        if (nextState === "active") {
          startListening();
        } else {
          setIsChecking(false);
        }
      },
    );

    if (AppState.currentState === "active") {
      startListening();
    }

    return () => {
      isActive = false;
      stopListening();
      appStateSubscription.remove();
    };
  }, [isTracking]);

  return {
    steps,
    isChecking,
    errorMessage,
  };
}
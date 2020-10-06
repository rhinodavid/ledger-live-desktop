// @flow
import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import {
  Countervalues,
  useCountervaluesState,
  useCountervaluesPolling,
} from "@ledgerhq/live-common/lib/countervalues/react";
import { inferTrackingPairForAccounts } from "@ledgerhq/live-common/lib/countervalues/logic";
import { setKey, getKey } from "~/renderer/storage";
import { accountsSelector } from "~/renderer/reducers/accounts";
import { counterValueCurrencySelector } from "~/renderer/reducers/settings";

export default function CountervaluesProvider({ children }: { children: React$Node }) {
  const trackingPairs = useTrackingPairs();
  const [initialCountervalues, setInitialCuntervalues] = useState();

  useEffect(() => {
    async function getInitialCountervalues() {
      const values = await getKey("app", "countervalues");
      setInitialCuntervalues(values);
    }
    getInitialCountervalues();
  }, []);

  return (
    <Countervalues
      initialCountervalues={initialCountervalues}
      userSettings={{ trackingPairs, autofillGaps: true }}
    >
      <CountervaluesManager>{children}</CountervaluesManager>
    </Countervalues>
  );
}

function CountervaluesManager({ children }: { children: React$Node }) {
  useCacheManager();
  usePollingManager();

  return children;
}

function useCacheManager() {
  const state = useCountervaluesState();
  useEffect(() => {
    setKey("app", "countervalues", state);
  }, [state]);
}

function usePollingManager() {
  const { start, stop } = useCountervaluesPolling();
  useEffect(() => {
    window.addEventListener("blur", stop);
    window.addEventListener("focus", start);
    return () => {
      window.removeEventListener("blur", stop);
      window.removeEventListener("focus", start);
    };
  }, [start, stop]);
}

export function useTrackingPairs() {
  const accounts = useSelector(accountsSelector);
  const countervalue = useSelector(counterValueCurrencySelector);
  return useMemo(() => inferTrackingPairForAccounts(accounts, countervalue), [
    accounts,
    countervalue,
  ]);
}

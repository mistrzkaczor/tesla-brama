# Tesla Gate Dashboard

Panel sterowania bramą zintegrowany z SUPLA.

## Aktualna wersja

**v3.3-stable**

Stabilna wersja projektu przeznaczona do codziennego użytkowania.

### Funkcje

- otwieranie bramy z poziomu dashboardu,
- zamykanie bramy z poziomu dashboardu,
- automatyczny odczyt rzeczywistego stanu bramy,
- aktualizacja statusu co 5 sekund,
- synchronizacja stanu również po użyciu pilota,
- blokowanie przycisku niezgodnego z aktualnym stanem bramy,
- obsługa interfejsu desktop / Tesla / urządzenia mobilne,
- interfejs inspirowany stylistyką Tesla.

### Stabilność

Wersja `v3.3-stable` została przetestowana pod kątem:

- sterowania bramą z dashboardu,
- zmiany stanu bramy pilotem,
- automatycznej aktualizacji statusu,
- działania na komputerze,
- działania na urządzeniu mobilnym.

### Ważne

Odczyt statusu realizowany jest przez API SUPLA.

Interwał odświeżania:

**5 sekund**

Nie należy zmniejszać interwału bez sprawdzenia limitów API SUPLA.

---

## Historia wersji

### v3.3-stable

- stabilizacja interfejsu,
- poprawiona wizualizacja aktywnego i nieaktywnego przycisku,
- stylistyka inspirowana Tesla Dashboard,
- automatyczne odświeżanie statusu,
- odświeżanie statusu co 5 sekund,
- poprawiona obsługa rzeczywistego stanu bramy.
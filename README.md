# HyperSpec - GMOverlay

Narzędzie stworzone na potrzeby koła naukowego HyperSpec AGH, do celów potwierdzania i zaktualizowania danych potencjalnych obiektów które oferują zniżki.

## Spis treści

- [Instalacja](#instalacja)
- [Jak korzystać?](#jak-korzystać)

## Instalacja

1. Sklonuj to repozytorium do wybranego folderu:

   ```bash
   git clone https://github.com/Misieeeek/HyperSpec-GMOverlay.git
   ```

2. Wklej plik znizki.csv do sklonowanego repozytorium.

3. Wejdź do przeglądarki chromium-based takiej jak: Google Chrome czy Brave (inne mogą nie działać poprawnie lub inaczej wygląda proces instalacji)

4. Wejdź w rozszerzenia poprzez kliknięcie na ikonkę hamburgera w prawym górnym rogu i następnie na opcję 'rozszerzenia'. Ewentualnie można poprzez wyszukiwarkę wpisując np. dla Brave: brave://extensions/

5. W rozszerzeniach w prawym górnym rogu powinien być przełącznik "Developer mode", powinien być zaznaczony.

6. Następnie w lewym górnym rogu powinna pojawić się opcja typu "Load unpacked", należy w nią kliknąć i wybrać sklonowane repozytorium.

7. Powinno się pojawić dodatkowe rozszerzenie o nazwie "Hyperspec - GMOverlay" z logo naszego koła naukowego. Upewnij się że rozszerzenie jest włączone.

8. Wejdź na [google maps](https://www.google.com/maps), powinien pojawić się po krótkiej chwili overlay po prawej stronie. Jeżeli tak jest, spróbuj przeładować rozszerzenie. Jeżeli to też nie działa, napisz do mnie na discordzie na kanale informatyka w wątku "GMOverlay - pomoc".

9. Przeczytaj [instrukcje obsługi](#jak-korzystać).

## Jak korzystać?

Za każdym razem wtyczka przejdzie do pierwszej lokalizacji w pliku .csv która nie została potwiedzona lub pominięta (o potwierdzeniu oraz pominięciu powiem później) według współrzędnych.

> [!CAUTION]
> Współrzędne mogą nie do końca się pokrywać ze znacznikiem na mapie.

### Co zrobić jak współrzędne nie są dokładnie w tym miejscu?

- Jeżeli na początku nie widać jakiegoś obiektu to poświęć chwilę aby go znaleźć w aktualnym obszarze.
- Jeżeli dalej nic nie widać to spróbuj przybliżyć do tej lokalizacji i poszukaj w pobliżu markera.
- Jeżeli dalej nie widać tego miejsa, spróbuj wpisać jego nazwę w wyszukiwarce.
- Jeżeli to także nie zadziała, zaznacz ten checkbox: "Brak zniżek, informacji na temat obiektu lub obiekt jest nieczynny\nie istnieje" oraz kliknij na przycisk aby przejść do następnej lokalizacji, wtedy dane na temat tego obiektu zostaną całkowicie pominięte w dalszej analizie.

> [!NOTE]
> Korzystaj z checkboxa "Brak zniżek, informacji na temat obiektu lub obiekt jest nieczynny\nie istnieje", tak jak sama jego nazwa wskazuje.

- Kiedy nie obsługuje zniżek
- Kiedy obiekt jest zamknięty na stałe lub na dobre
- Kiedy nie istnieje

### Jak pisać adres obiektu?

Najlepiej jest kopiować adres z markera.

> [!IMPORTANT]
> W przypadku braku danych na temat np. adresu, numeru telefonu, strony, typu miejsca czy godzin otwarcia i zamknięcia, to pozostaw puste te miejsca i nie zaznaczaj checkboxa aby pominąć jeżeli nie trzeba.

### Checkbox "Potwierdzenie telefoniczne lub internetowe", kiedy z tego korzystać?

W momencie gdy wszystkie dane zostaną zebrane oraz gdy zniżki zostaną wpisane, zaznacz ten checkbox a następnie kliknij przycisk aby przejść do następnej lokalizacji. W ten sposób zatwierdzisz dane i nie będą one brane w dalszym sprawdzaniu.

### Przycisk '⚠️ ZRESETUJ do pliku CSV' 

Usuwa dane z LocalStorage. Klikaj wtedy, kiedy ładujesz nowego chunka.  

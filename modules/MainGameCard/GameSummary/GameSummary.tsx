import { useGetMultipleCharactersByIds } from '@/modules/characters/hooks/useGetMultipleCharactersByIds/useGetMultipleCharactersByIds';
import { arraysHaveCommonItems } from '@/modules/characters/utils/arraysHaveCommonItems';
import { arraysHaveSameItems } from '@/modules/characters/utils/arraysHaveSameItems';
import { Button } from '@/modules/ui/Button/Button';
import { ErrorMessage } from '@/modules/ui/ErrorMessage/ErrorMessage';
import { Text } from '@/modules/ui/Text/Text';
import toast from 'react-hot-toast';
import { FaRegCopy } from 'react-icons/fa';

type Character = {
  imie: string;
  przynaleznosc: string[];
  wystepowanie: string[];
  bron: string[];
  zbroja: string[];
  zdjecie: string;
};

type GameSummaryProps = {
  guesses: number[];
  correctCharacter: Character;
};

const compareData = (
  correctData: string | string[],
  inputData: string | string[]
) => {
  const areArrays = Array.isArray(correctData) && Array.isArray(inputData);

  const isInputDataCorrect =
    (!areArrays && inputData === correctData) ||
    (areArrays && arraysHaveSameItems(inputData, correctData));

  const haveCommonElements =
    areArrays && arraysHaveCommonItems(inputData, correctData);

  if (isInputDataCorrect) {
    return '🟩';
  } else if (haveCommonElements && !isInputDataCorrect) {
    return '🟧';
  } else {
    return '🟥';
  }
};

const handleCopyToClipboard = (rows: string[][]) => {
  const formattedText = rows
    .map((singleRow) => singleRow.join(''))
    .reverse()
    .join('\n');

  const clipboardText =
    `Udalo mi sie zgadnac postac w #Gothicdle za ${rows.length} razem!\n` +
    formattedText +
    `\n gothicdle.vercel.app`;

  navigator.clipboard.writeText(clipboardText);
  toast.success('Skopiowano do schowka');
};

export const GameSummary = ({
  guesses,
  correctCharacter,
}: GameSummaryProps) => {
  const characters = useGetMultipleCharactersByIds(guesses);
  let allRows: string[][] = [];
  let singleRow: string[] = [];

  if (!characters.isSuccess)
    return (
      <ErrorMessage message='Nie udalo sie wczytac podsumowania. Sprobuj ponownie pozniej!' />
    );

  characters.data.forEach((character) => {
    singleRow.push(compareData(correctCharacter.imie, character.imie));
    singleRow.push(
      compareData(correctCharacter.przynaleznosc, character.przynaleznosc)
    );
    singleRow.push(
      compareData(correctCharacter.wystepowanie, character.wystepowanie)
    );
    singleRow.push(compareData(correctCharacter.bron, character.bron));
    singleRow.push(compareData(correctCharacter.zbroja, character.zbroja));
    allRows.push(singleRow);
    singleRow = [];
  });

  const first3rows = allRows.slice(0, 3);
  const last3rows = allRows.slice(allRows.length - 3, allRows.length);

  return (
    <div className='mb-4 mt-8 flex flex-col space-y-4'>
      <Text>
        Udalo ci sie zgadnac postac w #Gothicdle za {allRows.length} razem!
      </Text>

      {allRows.length > 6 ? (
        <div>
          {first3rows.map((guess, i) => (
            <Text key={guess.join('') + i}>{guess.join('')}</Text>
          ))}
          <Text>...</Text>
          {last3rows.map((guess, i) => (
            <Text key={guess.join('') + i}>{guess.join('')}</Text>
          ))}
        </div>
      ) : (
        <div>
          {allRows.map((guess, i) => (
            <Text key={guess.join('') + i}>{guess.join('')}</Text>
          ))}
        </div>
      )}
      <div>
        <Button
          size='sm'
          onClick={() => handleCopyToClipboard(allRows.reverse())}
        >
          <FaRegCopy size={30} />
        </Button>
      </div>
    </div>
  );
};

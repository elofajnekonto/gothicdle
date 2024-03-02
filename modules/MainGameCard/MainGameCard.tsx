'use client';

import { ChangeEvent, useState } from 'react';
import { useGetCharacterById } from '../characters/hooks/useGetCharacterById/useGetCharacterById';
import { useGetCharactersByName } from '../characters/hooks/useGetCharactersByName/useGetCharactersByName';
import { Card } from '../ui/Card/Card';
import { Text } from '../ui/Text/Text';
import { GuessResults } from './GuessResults/GuessResults';
import { Searchbar } from './Searchbar/Searchbar';
import { SearchResult } from './SearchResult/SearchResult';

const TEST_INPUT_CHAR_ID = 1;
const TEST_CORRECT_CHAR_ID = 1;

export const MainGameCard = () => {
  const correctCharacter = useGetCharacterById(TEST_CORRECT_CHAR_ID);

  const [searchInput, setSearchInput] = useState('');
  const [guessesMade, setGuessesMade] = useState<number[]>([]);

  const testGetCharactersByName = useGetCharactersByName(searchInput);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSearchInput(e.target.value);
  };

  const handleMakeNewGuess = (guessId: number) => {
    const newGuesses = [...guessesMade, guessId];
    setGuessesMade(newGuesses);
  };

  const charactersAvailableToGuess = testGetCharactersByName?.data?.filter(
    (character) => !guessesMade.includes(character.id)
  );

  if (correctCharacter.isLoading)
    return <Text variant='danger'>Loading gierki</Text>;
  if (!correctCharacter.isSuccess)
    return <Text variant='danger'>Error message</Text>;

  return (
    <Card>
      <div className='relative justify-center'>
        <Searchbar
          onChange={handleInputChange}
          onSubmit={() => console.log(testGetCharactersByName.data)}
          value={searchInput}
          // searchResults={testGetCharactersByName.data}
        />
        <div className='absolute w-full'>
          {searchInput &&
            charactersAvailableToGuess?.map((character, i) => (
              <SearchResult
                onClick={() => handleMakeNewGuess(character.id)}
                characterName={character.imie}
                key={character.imie}
              />
            ))}
        </div>
      </div>
      {guessesMade &&
        guessesMade
          .slice()
          .reverse()
          .map((id) => (
            <GuessResults
              key={id}
              character={correctCharacter.data}
              inputCharacterId={id}
            />
          ))}

      <Text>Dzisiejsza postac to {correctCharacter.data.imie}</Text>
    </Card>
  );
};

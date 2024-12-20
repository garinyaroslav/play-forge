import { ipcMain } from 'electron';
import { dataSource as ds } from '../db';
import { GameGenre } from '../../entity/GameGenre';
import { IGenre } from '../../renderer/types/genre';

ipcMain.handle('api:getGenres', async () => {
  try {
    const genres = await ds
      .createQueryBuilder()
      .select('GameGenre')
      .from(GameGenre, 'GameGenre')
      .orderBy('GameGenre.id', 'ASC')
      .getMany();
    return genres;
  } catch (error) {
    console.error(error);
    return false;
  }
});

ipcMain.handle('api:getGenre', async (_, genreId: number) => {
  try {
    const genre = await ds
      .createQueryBuilder()
      .select('GameGenre')
      .from(GameGenre, 'GameGenre')
      .where('GameGenre.id = :genreId', { genreId })
      .getMany();
    return genre;
  } catch (error) {
    console.error(error);
    return false;
  }
});

ipcMain.handle('api:addGenre', async (_, newGenre: IGenre) => {
  try {
    return await ds
      .createQueryBuilder()
      .insert()
      .into(GameGenre)
      .values({ id: newGenre.id, genreName: newGenre.genreName })
      .execute();
  } catch (error) {
    console.error(error);
    return false;
  }
});

ipcMain.handle('api:deleteGenre', async (_, genreId: number) => {
  try {
    return await ds
      .createQueryBuilder()
      .delete()
      .from(GameGenre)
      .where('id = :id', { id: genreId })
      .execute();
  } catch (error) {
    console.error(error);
    return false;
  }
});

ipcMain.handle('api:updateGenre', async (_, newGenre: IGenre) => {
  try {
    return await ds
      .createQueryBuilder()
      .update(GameGenre)
      .set(newGenre)
      .where('id = :id', { id: newGenre.id })
      .execute();
  } catch (error) {
    console.error(error);
    return false;
  }
});

ipcMain.handle('api:getGenresBySearchValue', async (_, searchVal: string) => {
  try {
    const games = await ds
      .createQueryBuilder()
      .select('GameGenre')
      .from(GameGenre, 'GameGenre')
      .where('GameGenre.genreName ILIKE :search', { search: `%${searchVal}%` })
      .orWhere('CAST(GameGenre.id AS TEXT) LIKE :search', {
        search: `%${searchVal}%`,
      })
      .getMany();
    return games;
  } catch (error) {
    console.error(error);
    return false;
  }
});

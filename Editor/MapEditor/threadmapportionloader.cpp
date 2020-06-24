/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "rpm.h"
#include "threadmapportionloader.h"
#include "map.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

ThreadMapPortionLoader::ThreadMapPortionLoader(Map *map, MapPortion *mapPortion,
    QString path) :
    m_map(map),
    m_mapPortion(mapPortion),
    m_path(path)
{

}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void ThreadMapPortionLoader::process() {
    m_map->loadPortionThread(m_mapPortion, m_path);
    emit finished();
}

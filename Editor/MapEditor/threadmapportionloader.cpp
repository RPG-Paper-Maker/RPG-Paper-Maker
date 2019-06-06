/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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

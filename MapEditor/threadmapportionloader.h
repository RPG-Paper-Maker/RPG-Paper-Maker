/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef THREADMAPPORTIONLOADER_H
#define THREADMAPPORTIONLOADER_H

#include <QThread>

class Map;
class MapPortion;

// -------------------------------------------------------
//
//  CLASS ThreadMapPortionLoader
//
//  A thread used for loading a portion asynchronously.
//
// -------------------------------------------------------

class ThreadMapPortionLoader : public QThread
{
    Q_OBJECT
public:
    ThreadMapPortionLoader(Map* map, MapPortion* mapPortion);

protected:
    Map* m_map;
    MapPortion* m_mapPortion;
    /*
    int m_realX;
    int m_realY;
    int m_realZ;
    int m_x;
    int m_y;
    int m_z;*/

    void run();
};

#endif // THREADMAPPORTIONLOADER_H

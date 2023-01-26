/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef THREADMAPPORTIONLOADER_H
#define THREADMAPPORTIONLOADER_H

#include <QObject>

class Map;
class MapPortion;

// -------------------------------------------------------
//
//  CLASS ThreadMapPortionLoader
//
//  A thread used for loading a portion asynchronously.
// /!\ THAT CLASS IS DEPRECATED, WILL BE REMOVED
//
// -------------------------------------------------------

class ThreadMapPortionLoader : public QObject
{
    Q_OBJECT
public:
    ThreadMapPortionLoader(Map* map, MapPortion* mapPortion, QString path);

protected:
    Map* m_map;
    MapPortion* m_mapPortion;
    QString m_path;

    /*
    int m_realX;
    int m_realY;
    int m_realZ;
    int m_x;
    int m_y;
    int m_z;*/

public slots:
    void process();
signals:
    void finished();
    void error(QString err);
};

#endif // THREADMAPPORTIONLOADER_H

/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef SONGKIND_H
#define SONGKIND_H

#include <QMetaType>

// -------------------------------------------------------
//
//  ENUM SongKind
//
//  All the possible songs.
//
// -------------------------------------------------------

enum class SongKind {
    None,
    Music,
    BackgroundSound,
    Sound,
    MusicEffect,
    Last
};

inline uint qHash(SongKind pos)
{
   return (int) pos;
}

Q_DECLARE_METATYPE(SongKind)

#endif // SONGKIND_H

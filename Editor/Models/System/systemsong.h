/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef SYSTEMSONG_H
#define SYSTEMSONG_H

#include <QMetaType>
#include "systemresource.h"
#include "songkind.h"

// -------------------------------------------------------
//
//  CLASS SystemSong
//
//  A particulary song.
//
// -------------------------------------------------------

class SystemSong : public SystemResource
{
public:
    SystemSong();
    SystemSong(int i, QString n, bool isBR, QString dlc = "", SongKind kind =
        SongKind::None);
    virtual ~SystemSong();
    void setKind(SongKind kind);

    static QString getFolder(SongKind kind, bool isBR = false, QString dlc = "");
    static QString getLocalFolder(SongKind kind);
    static QString getSongTitle(SongKind kind);

    virtual QString getPath() const;
    virtual QString getLocalPath() const;
    virtual SuperListItem* createCopy() const;
    virtual void setCopy(const SuperListItem &super);

protected:
    SongKind m_kind;
};

Q_DECLARE_METATYPE(SystemSong)

#endif // SYSTEMSONG_H

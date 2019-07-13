/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef SYSTEMSONG_H
#define SYSTEMSONG_H

#include <QMetaType>
#include "superlistitem.h"
#include "songkind.h"

// -------------------------------------------------------
//
//  CLASS SystemSong
//
//  A particulary song.
//
// -------------------------------------------------------

class SystemSong : public SuperListItem
{
public:
    SystemSong();
    SystemSong(int i, QString n, bool isBR);
    virtual ~SystemSong();
    bool isBR() const;
    void setIsBR(bool b);
    static QString getFolder(SongKind kind, bool isBR);
    static QString getLocalFolder(SongKind kind);
    static QString getSongTitle(SongKind kind);
    QString getPath(SongKind kind) const;
    QString getLocalPath(SongKind kind) const;

    virtual SuperListItem* createCopy() const;
    virtual void setCopy(const SystemSong &super);
    virtual QList<QStandardItem*> getModelRow() const;

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    bool m_isBR;
};

Q_DECLARE_METATYPE(SystemSong)

#endif // SYSTEMSONG_H

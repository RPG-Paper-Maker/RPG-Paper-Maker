/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef SYSTEMVIDEO_H
#define SYSTEMVIDEO_H

#include <QMetaType>
#include "superlistitem.h"

// -------------------------------------------------------
//
//  CLASS SystemVideo
//
//  A particulary video.
//
// -------------------------------------------------------

class SystemVideo : public SuperListItem
{
public:
    static const QString JSON_BR;

    SystemVideo();
    SystemVideo(int i, QString n, bool isBR);
    virtual ~SystemVideo();

    bool isBR() const;
    void setIsBR(bool b);

    static SystemVideo * getByID(int id);
    static QString getFolder(bool isBR);
    static QString getLocalFolder();

    QString getPath() const;
    QString getLocalPath() const;

    virtual SuperListItem * createCopy() const;
    virtual void setCopy(const SuperListItem &super);
    virtual QList<QStandardItem*> getModelRow() const;
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    bool m_isBR;
};

#endif // SYSTEMVIDEO_H

/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef SYSTEMRESOURCE_H
#define SYSTEMRESOURCE_H

#include <QMetaType>
#include "superlistitem.h"

// -------------------------------------------------------
//
//  CLASS SystemResource
//
//  A particulary resource (picture, song, video, shape).
//
// -------------------------------------------------------

class SystemResource : public SuperListItem
{
public:
    SystemResource();
    SystemResource(int i, QString n, bool isBR, QString dlc = "");
    virtual ~SystemResource();
    bool isBR() const;
    void setIsBR(bool b);
    QString dlc() const;
    void setDlc(QString dlc);
    QString base64() const;
    void setBase64(QString base64);

    static QString getFolder(bool br, QString dlc);

    virtual QString getPath() const;
    virtual QString getLocalPath() const;
    virtual SuperListItem* createCopy() const;
    virtual void setCopy(const SuperListItem &super);
    virtual QList<QStandardItem*> getModelRow() const;
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    bool m_isBR;
    QString m_dlc;
    QString m_base64;
};

Q_DECLARE_METATYPE(SystemResource)

#endif // SYSTEMRESOURCE_H

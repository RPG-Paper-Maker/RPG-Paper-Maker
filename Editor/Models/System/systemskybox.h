/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef SYSTEMSKYBOX_H
#define SYSTEMSKYBOX_H

#include <QMetaType>
#include "superlistitem.h"

// -------------------------------------------------------
//
//  CLASS SystemSkyBox
//
//  A particulary sky box (datas).
//
// -------------------------------------------------------

class SystemSkyBox : public SuperListItem
{
public:
    static const QString JSON_FRONT_ID;
    static const QString JSON_BACK_ID;
    static const QString JSON_TOP_ID;
    static const QString JSON_BOTTOM_ID;
    static const QString JSON_LEFT_ID;
    static const QString JSON_RIGHT_ID;
    static const int DEFAULT_FRONT_ID;
    static const int DEFAULT_BACK_ID;
    static const int DEFAULT_TOP_ID;
    static const int DEFAULT_BOTTOM_ID;
    static const int DEFAULT_LEFT_ID;
    static const int DEFAULT_RIGHT_ID;

    SystemSkyBox();
    SystemSkyBox(int i, QString n, int fid = DEFAULT_FRONT_ID, int bid =
        DEFAULT_BACK_ID, int tid = DEFAULT_TOP_ID, int boid = DEFAULT_BOTTOM_ID,
        int lid = DEFAULT_LEFT_ID, int rid = DEFAULT_RIGHT_ID);
    virtual ~SystemSkyBox();
    SuperListItem * frontID() const;
    SuperListItem * backID() const;
    SuperListItem * topID() const;
    SuperListItem * bottomID() const;
    SuperListItem * leftID() const;
    SuperListItem * rightID() const;

    virtual bool openDialog();
    virtual SuperListItem * createCopy() const;
    virtual void setCopy(const SuperListItem &super);
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    SuperListItem *m_frontID;
    SuperListItem *m_backID;
    SuperListItem *m_topID;
    SuperListItem *m_bottomID;
    SuperListItem *m_leftID;
    SuperListItem *m_rightID;
};

Q_DECLARE_METATYPE(SystemSkyBox)

#endif // SYSTEMSKYBOX_H

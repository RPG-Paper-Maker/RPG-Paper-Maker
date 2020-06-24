/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef SYSTEMCLASSSKILL_H
#define SYSTEMCLASSSKILL_H

#include <QMetaType>
#include "superlistitem.h"

// -------------------------------------------------------
//
//  CLASS SystemClassSkill
//
//  A particulary class skill (datas).
//
// -------------------------------------------------------

class SystemClassSkill : public SuperListItem
{
public:
    SystemClassSkill();
    SystemClassSkill(int i, QString n, int l);
    virtual ~SystemClassSkill();
    int level() const;
    void setLevel(int i);

    virtual bool openDialog();
    virtual SuperListItem* createCopy() const;
    virtual void setCopy(const SuperListItem &super);
    virtual QList<QStandardItem*> getModelRow() const;

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    int m_level;
};

Q_DECLARE_METATYPE(SystemClassSkill)

#endif // SYSTEMCLASSSKILL_H

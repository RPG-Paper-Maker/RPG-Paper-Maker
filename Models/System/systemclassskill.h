/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
    virtual void setCopy(const SystemClassSkill &skill);
    virtual QList<QStandardItem*> getModelRow() const;

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    int m_level;
};

Q_DECLARE_METATYPE(SystemClassSkill)

#endif // SYSTEMCLASSSKILL_H

/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef SYSTEMELEMENT_H
#define SYSTEMELEMENT_H

#include <QStandardItemModel>
#include <QMetaType>
#include "systemicon.h"
#include "systemprimitive.h"

// -------------------------------------------------------
//
//  CLASS SystemElement
//
//  A particulary element (system).
//
// -------------------------------------------------------

class SystemElement : public SystemIcon
{
public:
    static const QString JSON_EFFICIENCY;

    SystemElement();
    SystemElement(int i, LangsTranslation *names, int ii);
    virtual ~SystemElement();
    QStandardItemModel* modelEfficiency() const;

    void clearEfficiency();
    void addEfficiencyDouble(int id, double d);
    void updateEfficiency();
    void updateEfficiencyChange();

    virtual bool openDialog();
    virtual SuperListItem* createCopy() const;
    virtual void setCopy(const SuperListItem &super);
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    QHash<int, PrimitiveValue *> m_efficiency;
    QStandardItemModel * m_modelEfficiency;
};

Q_DECLARE_METATYPE(SystemElement)

#endif // SYSTEMELEMENT_H

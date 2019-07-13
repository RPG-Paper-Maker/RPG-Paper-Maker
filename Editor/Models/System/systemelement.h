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
#include "systemlang.h"

// -------------------------------------------------------
//
//  CLASS SystemElement
//
//  A particulary element (system).
//
// -------------------------------------------------------

class SystemElement : public SystemLang
{
public:
    SystemElement();
    SystemElement(int i, LangsTranslation *names,
                  QStandardItemModel* efficiency = new QStandardItemModel);
    virtual ~SystemElement();
    QStandardItemModel* efficiency() const;
    virtual bool openDialog();
    virtual SuperListItem* createCopy() const;
    virtual void setCopy(const SystemElement& element);

    virtual void read(const QJsonObject &json);
    void readEfficiency(QStandardItemModel* model, const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    QStandardItemModel* m_efficiency;
};

Q_DECLARE_METATYPE(SystemElement)

#endif // SYSTEMELEMENT_H

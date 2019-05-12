/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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

/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef SYSTEMCHECKABLE_H
#define SYSTEMCHECKABLE_H

#include "superlistitem.h"

class SystemCheckable : public SuperListItem
{
public:
    static const QString JSON_CHECKED;
    static const bool DEFAULT_CHECKED;

    SystemCheckable(int id = -1, QString name = "", bool checked = DEFAULT_CHECKED);
    virtual ~SystemCheckable();
    bool checked() const;
    void setChecked(bool checked);

    virtual SuperListItem* createCopy() const;
    virtual void setCopy(const SuperListItem &super);
    virtual QList<QStandardItem*> getModelRow() const;
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    bool m_checked;
};

#endif // SYSTEMCHECKABLE_H

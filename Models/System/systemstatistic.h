/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    This file is part of RPG Paper Maker.

    RPG Paper Maker is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RPG Paper Maker is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

#ifndef SYSTEMSTATISTIC_H
#define SYSTEMSTATISTIC_H

#include <QMetaType>
#include "systemlang.h"

// -------------------------------------------------------
//
//  CLASS SystemStatistic
//
//  A particulary statistic (system).
//
// -------------------------------------------------------

class SystemStatistic : public SystemLang
{
public:
    SystemStatistic();
    SystemStatistic(int i, LangsTranslation *names, QString abbreviation,
                    bool isFix);
    virtual ~SystemStatistic();
    QString abbreviation() const;
    void setAbbreviation(QString s);
    bool isFix() const;
    void setIsFix(bool b);
    virtual bool openDialog();
    virtual SuperListItem* createCopy() const;
    virtual void setCopy(const SystemStatistic& statistic);

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    QString m_abbreviation;
    bool m_isFix;
};

Q_DECLARE_METATYPE(SystemStatistic)

#endif // SYSTEMSTATISTIC_H

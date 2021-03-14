/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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
    SystemStatistic(int i, QString name, QString abbreviation, bool isFix);
    virtual ~SystemStatistic();
    QString abbreviation() const;
    void setAbbreviation(QString s);
    bool isFix() const;
    void setIsFix(bool b);
    virtual bool openDialog();
    virtual SuperListItem* createCopy() const;
    virtual void setCopy(const SuperListItem &super);
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    QString m_abbreviation;
    bool m_isFix;
};

Q_DECLARE_METATYPE(SystemStatistic)

#endif // SYSTEMSTATISTIC_H

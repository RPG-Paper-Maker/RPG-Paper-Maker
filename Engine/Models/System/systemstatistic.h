/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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

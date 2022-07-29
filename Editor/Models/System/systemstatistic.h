/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef SYSTEMSTATISTIC_H
#define SYSTEMSTATISTIC_H

#include <QMetaType>
#include "systemtranslatable.h"

// -------------------------------------------------------
//
//  CLASS SystemStatistic
//
//  A particulary statistic (system).
//
// -------------------------------------------------------

class SystemStatistic : public SystemTranslatable
{
public:
    SystemStatistic();
    SystemStatistic(int i, QString name, QString abbreviation, bool isFix,
        SuperListItem *pictureBarID = new SuperListItem(-1));
    virtual ~SystemStatistic();
    QString abbreviation() const;
    void setAbbreviation(QString s);
    bool isFix() const;
    void setIsFix(bool b);
    SuperListItem * pictureBarID() const;
    virtual bool openDialog();
    virtual SuperListItem* createCopy() const;
    virtual void setCopy(const SuperListItem &super);
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    QString m_abbreviation;
    bool m_isFix;
    SuperListItem *m_pictureBarID;
};

Q_DECLARE_METATYPE(SystemStatistic)

#endif // SYSTEMSTATISTIC_H

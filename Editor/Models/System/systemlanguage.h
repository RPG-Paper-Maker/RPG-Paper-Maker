/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef SYSTEMLANGUAGE_H
#define SYSTEMLANGUAGE_H

#include <QMetaType>
#include "superlistitem.h"
#include "languagekind.h"

class SystemLanguage : public SuperListItem
{
public:
    static const QString JSON_KIND;
    static const QString DEFAULT_NAME;
    static const LanguageKind DEFAULT_KIND;

    SystemLanguage(int i = -1, QString name = DEFAULT_NAME, LanguageKind kind =
        DEFAULT_KIND);
    virtual ~SystemLanguage();
    LanguageKind kind() const;
    void setKind(LanguageKind kind);

    virtual bool openDialog();
    virtual SuperListItem* createCopy() const;
    virtual void setCopy(const SuperListItem &super);
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    LanguageKind m_kind;
};

Q_DECLARE_METATYPE(SystemLanguage)

#endif // SYSTEMLANGUAGE_H

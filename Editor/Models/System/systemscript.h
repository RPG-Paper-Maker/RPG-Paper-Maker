/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef SYSTEMSCRIPT_H
#define SYSTEMSCRIPT_H

#include "superlistitem.h"

// -------------------------------------------------------
//
//  CLASS SystemScript
//
//  A particulary script (datas).
//
// -------------------------------------------------------

class SystemScript : public SuperListItem
{
public:
    SystemScript();
    SystemScript(int i, QString name);
    virtual ~SystemScript();
    bool changed() const;
    QString currentCode() const;
    bool editable() const;
    void setChanged(bool changed);
    void setCurrentCode(QString currentCode);

    QString getCode();

    virtual bool checkChanged() const;
    virtual QString getPath() const;
    virtual QString toStringName() const;
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    bool m_changed;
    QString m_currentCode;
    bool m_editable;
};

Q_DECLARE_METATYPE(SystemScript)

#endif // SYSTEMSCRIPT_H

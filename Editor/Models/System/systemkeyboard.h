/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef SYSTEMKEYBOARD_H
#define SYSTEMKEYBOARD_H

#include "systemlang.h"

// -------------------------------------------------------
//
//  CLASS SystemKeyBoard
//
//  A particulary key (keyboard).
//
// -------------------------------------------------------

class SystemKeyBoard : public SystemLang
{
public:
    SystemKeyBoard();
    SystemKeyBoard(int i, QString name, QString abreviation);
    SystemKeyBoard(int i, QString name, QString abreviation, QVector<QVector<int>>
        shortcut);
    virtual ~SystemKeyBoard();
    QString abbreviation() const;
    void setAbbreviation(QString s);
    void appendShortCut(QVector<int> v);
    void updateLastShortCut(QVector<int> v);
    QString shortCutString() const;
    bool isEqual(int key) const;
    void removeLast();
    void removeAll();
    virtual QString toString() const;
    virtual bool openDialog();
    virtual SuperListItem* createCopy() const;
    virtual void setCopy(const SuperListItem &super);
    virtual QList<QStandardItem*> getModelRow() const;

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    QString m_abbreviation;
    QVector<QVector<int>> m_shortcuts;

};

Q_DECLARE_METATYPE(SystemKeyBoard)

#endif // SYSTEMKEYBOARD_H

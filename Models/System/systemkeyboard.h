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
    SystemKeyBoard(int i, LangsTranslation *names, QString abreviation);
    SystemKeyBoard(int i, LangsTranslation *names, QString abreviation,
                   QVector<QVector<int>> shortcut);
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
    virtual void setCopy(const SystemKeyBoard &k);
    virtual QList<QStandardItem*> getModelRow() const;

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    QString m_abbreviation;
    QVector<QVector<int>> m_shortcuts;

};

Q_DECLARE_METATYPE(SystemKeyBoard)

#endif // SYSTEMKEYBOARD_H

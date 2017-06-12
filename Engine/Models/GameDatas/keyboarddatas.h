/*
    RPG Paper Maker Copyright (C) 2017 Marie Laporte

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

#ifndef KEYBOARDDATAS_H
#define KEYBOARDDATAS_H

#include <QStandardItemModel>
#include "serializable.h"
#include "systemkeyboard.h"
#include "keyboardenginekind.h"

// -------------------------------------------------------
//
//  CLASS KeyBoardDatas
//
//  Contains all keyboard datas. The data file is located in
//  Content/Datas/keyBoard.json.
//
// -------------------------------------------------------

class KeyBoardDatas : public Serializable
{
public:
    KeyBoardDatas();
    virtual ~KeyBoardDatas();
    void read(QString path);
    QStandardItemModel* model() const;
    int keyAction() const;
    int keyCancel() const;
    int keyUp() const;
    int keyDown() const;
    int keyLeft() const;
    int keyRight() const;
    void setKeyAction(int k);
    void setKeyCancel(int k);
    void setKeyUp(int k);
    void setKeyDown(int k);
    void setKeyLeft(int k);
    void setKeyRight(int k);
    void setDefaultEngine();
    void setDefaultGame();

    bool isEqual(int key, KeyBoardEngineKind kind) const;

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

private:
    QStandardItemModel* m_model;
    int m_keyAction;
    int m_keyCancel;
    int m_keyUp;
    int m_keyDown;
    int m_keyLeft;
    int m_keyRight;

    void setDefault(QVector<SystemKeyBoard*>& list);
};

#endif // KEYBOARDDATAS_H

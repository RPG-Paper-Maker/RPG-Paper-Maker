/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
    void updateHeader();

    bool isEqual(int key, KeyBoardEngineKind kind) const;
    bool contains(QSet<int> keysPressed, KeyBoardEngineKind kind) const;

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

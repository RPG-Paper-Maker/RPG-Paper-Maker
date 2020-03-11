/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGSYSTEMPROPERTY_H
#define DIALOGSYSTEMPROPERTY_H

#include <QDialog>
#include "systemproperty.h"

namespace Ui {
class DialogSystemProperty;
}

class DialogSystemProperty : public QDialog
{
    Q_OBJECT

public:
    explicit DialogSystemProperty(SystemProperty &property, QWidget *parent = nullptr);
    ~DialogSystemProperty();

private:
    Ui::DialogSystemProperty *ui;
    SystemProperty &m_property;

    void initialize();
    void translate();

private slots:
    void on_lineEditName_textEdited(const QString &text);
};

#endif // DIALOGSYSTEMPROPERTY_H

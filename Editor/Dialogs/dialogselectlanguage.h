/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGSELECTLANGUAGE_H
#define DIALOGSELECTLANGUAGE_H

#include <QDialog>

// -------------------------------------------------------
//
//  CLASS DialogSelectLanguage
//
//  Dialog for selecting the engine language.
//
// -------------------------------------------------------

namespace Ui {
class DialogSelectLanguage;
}

class DialogSelectLanguage : public QDialog
{
    Q_OBJECT

public:
    explicit DialogSelectLanguage(QString lang = QString(), QWidget *parent =
        nullptr);
    ~DialogSelectLanguage();

private:
    Ui::DialogSelectLanguage *ui;

    void initialize(QString &lang);
    void translate();

public slots:
    void on_comboBox_currentIndexChanged(int index);
};

#endif // DIALOGSELECTLANGUAGE_H

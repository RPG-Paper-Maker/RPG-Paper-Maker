/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGSYSTEMLANGUAGE_H
#define DIALOGSYSTEMLANGUAGE_H

#include <QDialog>
#include "systemlanguage.h"

namespace Ui {
class DialogSystemLanguage;
}

class DialogSystemLanguage : public QDialog
{
    Q_OBJECT

public:
    explicit DialogSystemLanguage(SystemLanguage &language, QWidget *parent = nullptr);
    ~DialogSystemLanguage();

    void initialize();
    void translate();

private:
    Ui::DialogSystemLanguage *ui;
    SystemLanguage &m_language;
    bool m_block;

public slots:
    void on_lineEditName_textEdited(const QString &text);
    void on_comboBoxType_currentIndexChanged(int index);
};

#endif // DIALOGSYSTEMLANGUAGE_H

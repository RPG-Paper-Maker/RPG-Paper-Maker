/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGSYSTEMTRANSLATABLE_H
#define DIALOGSYSTEMTRANSLATABLE_H

#include <QDialog>
#include "systemtranslatable.h"

// -------------------------------------------------------
//
//  CLASS DialogSystemTranslatable
//
//  A dialog used for editing the model of a system lang.
//
// -------------------------------------------------------

namespace Ui {
class DialogSystemTranslatable;
}

class DialogSystemTranslatable : public QDialog
{
    Q_OBJECT

public:
    explicit DialogSystemTranslatable(SystemTranslatable& model, QWidget *parent = 0);
    ~DialogSystemTranslatable();

private:
    Ui::DialogSystemTranslatable *ui;
    SystemTranslatable& m_model;

    void initialize();
    void translate();

public slots:
    void on_lineEditAll_textEdited(const QString &text);
};

#endif // DIALOGSYSTEMTRANSLATABLE_H

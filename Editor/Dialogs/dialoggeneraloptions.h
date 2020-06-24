/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGGENERALOPTIONS_H
#define DIALOGGENERALOPTIONS_H

#include <QDialog>

// -------------------------------------------------------
//
//  CLASS DialogGeneralOptions
//
//  A dialog used for setting general options.
//
// -------------------------------------------------------

namespace Ui {
class DialogGeneralOptions;
}

class DialogGeneralOptions : public QDialog
{
    Q_OBJECT

public:
    explicit DialogGeneralOptions(QWidget *parent = nullptr);
    ~DialogGeneralOptions();

private:
    Ui::DialogGeneralOptions *ui;

    void initialize();
    void translate();

public slots:
    virtual void accept();
    virtual void reject();
    void on_comboBoxThemeCurrentIndexChanged(int index);
};

#endif // DIALOGGENERALOPTIONS_H

/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef WIDGETCOMPLEXMESSAGE_H
#define WIDGETCOMPLEXMESSAGE_H

#include <QWidget>
#include <QStandardItemModel>
#include <QComboBox>

namespace Ui {
class WidgetComplexMessage;
}

class WidgetComplexMessage : public QWidget
{
    Q_OBJECT

public:
    static const QString TAG_BOLD;
    static const QString TAG_ITALIC;
    static const QString TAG_LEFT;
    static const QString TAG_CENTER;
    static const QString TAG_RIGHT;
    static const QString TAG_FONT_SIZE;
    static const QString TAG_FONT_NAME;
    static const QString TAG_TEXT_COLOR;
    static const QString TAG_BACK_COLOR;
    static const QString TAG_STROKE_COLOR;
    static const QString TAG_VARIABLE;
    static const QString TAG_PARAMETER;
    static const QString TAG_PROPERTY;
    static const QString TAG_HERO_NAME;
    static const QString TAG_ICON;

    explicit WidgetComplexMessage(QWidget *parent = nullptr);
    ~WidgetComplexMessage();
    QString text() const;
    void setText(QString text);

    void initializeWidgets(QStandardItemModel *properties, QStandardItemModel
        *parameters);
    void insertTag(int index, QComboBox *combobox, QString tag,
        QStandardItemModel *model, int modelIndex, bool closure = true);
    void insertNoValueTag(QString tag);
    void translate();

private:
    Ui::WidgetComplexMessage *ui;
    QStandardItemModel *m_parameters;
    QStandardItemModel *m_properties;

public slots:
    void on_pushButtonBold_clicked();
    void on_pushButtonItalic_clicked();
    void on_pushButtonLeft_clicked();
    void on_pushButtonCenter_clicked();
    void on_pushButtonRight_clicked();
    void on_comboBoxFontSize_currentIndexChanged(int index);
    void on_comboBoxFontName_currentIndexChanged(int index);
    void on_comboBoxTextColor_currentIndexChanged(int index);
    void on_comboBoxBackColor_currentIndexChanged(int index);
    void on_comboBoxStrokeColor_currentIndexChanged(int index);
    void on_comboBoxVariable_currentIndexChanged(int index);
    void on_comboBoxParameters_currentIndexChanged(int index);
    void on_comboBoxProperties_currentIndexChanged(int index);
    void on_comboBoxHeroName_currentIndexChanged(int index);
    void on_pushButtonIcon_clicked();
};

#endif // WIDGETCOMPLEXMESSAGE_H
